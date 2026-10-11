"""Offline, no-network checks for a prospective founder-gated Hall release."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "validation" / (name + ".py"))
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj


intent = load("verify_hall_release_intent")
bundle = load("build_hall_release")
cf = load("verify_cloudflare_release_mode")
S = "a" * 40
T = "b" * 40


def valid_intent():
    return [S, "workflow_dispatch", "refs/heads/main", S, S, S]


def mock_project():
    return {
        "name": "codex-interface",
        "production_branch": "main",
        "source": {"type": "github", "config": {
            "owner": "sovereign-codex",
            "repo_name": "Codex-interface-",
            "production_branch": "main",
            "production_deployments_enabled": False,
            "preview_deployment_setting": "all"
        }}
    }


def mock_deployment():
    return {
        "id": "test-deployment",
        "environment": "production",
        "deployment_trigger": {"metadata": {"commit_hash": S, "branch": "main"}},
        "latest_stage": {"status": "success"}
    }


class ReleaseIntentTests(unittest.TestCase):
    def test_exact_candidate_is_only_eligible_to_request_review(self):
        result = intent.evaluate_intent(*valid_intent())
        self.assertEqual(result["authority_effect"], "none")
        self.assertFalse(result["deployment_performed"])

    def test_sha_cannot_be_omitted(self):
        x = valid_intent()
        x[0] = ""
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_sha_cannot_be_uppercase(self):
        x = valid_intent()
        x[0] = "A" * 40
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_only_manual_workflow(self):
        x = valid_intent()
        x[1] = "push"
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_disallow_feature_branch(self):
        x = valid_intent()
        x[2] = "refs/heads/feature"
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_disallow_moved_event(self):
        x = valid_intent()
        x[3] = T
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_disallow_mismatched_source_tree(self):
        x = valid_intent()
        x[4] = T
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)

    def test_disallow_main_head_race(self):
        x = valid_intent()
        x[5] = T
        with self.assertRaises(intent.ReleaseHold):
            intent.evaluate_intent(*x)


class CloudflareReadbackTests(unittest.TestCase):
    def test_manual_only_preserves_previews(self):
        self.assertEqual(cf.verify_project(mock_project())["authority_effect"], "none")

    def test_refuse_automatic_production_mode(self):
        p = mock_project()
        p["source"]["config"]["production_deployments_enabled"] = True
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_project(p)

    def test_refuse_ambiguous_production_mode(self):
        p = mock_project()
        del p["source"]["config"]["production_deployments_enabled"]
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_project(p)

    def test_refuse_wrong_project(self):
        p = mock_project()
        p["name"] = "another-project"
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_project(p)

    def test_refuse_preview_loss(self):
        p = mock_project()
        p["source"]["config"]["preview_deployment_setting"] = "none"
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_project(p)

    def test_verify_only_actual_successful_production_commit(self):
        self.assertEqual(cf.verify_deployment(mock_deployment(), S)["commit"], S)

    def test_refuse_preview_as_production(self):
        d = mock_deployment()
        d["environment"] = "preview"
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_deployment(d, S)

    def test_refuse_old_production_commit(self):
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_deployment(mock_deployment(), T)

    def test_refuse_build_not_complete(self):
        d = mock_deployment()
        d["latest_stage"]["status"] = "active"
        with self.assertRaises(cf.CloudflareHold):
            cf.verify_deployment(d, S)


class StagedPublicArtifactTests(unittest.TestCase):
    def test_only_expected_public_routes(self):
        sample = sorted(bundle.REQUIRED | {
            ".github/workflows/release.yml", "validation/internal.py",
            "README.md", "secrets.env", "assets/css/style.css", "assets/.env",
            "architecture/private.md", "terminal/_worker.js",
        })
        chosen = bundle.select_files(sample)
        self.assertIn("assets/css/style.css", chosen)
        self.assertIn(".well-known/tyme.json", chosen)
        for excluded in (".github/workflows/release.yml", "validation/internal.py",
                         "README.md", "secrets.env", "assets/.env",
                         "architecture/private.md", "terminal/_worker.js"):
            self.assertNotIn(excluded, chosen)

    def test_no_dotdot_path(self):
        with self.assertRaises(bundle.BuildHold):
            bundle.public_path("../assets/secret.js")

    def test_no_backslash_path(self):
        with self.assertRaises(bundle.BuildHold):
            bundle.public_path("assets\\..\\secret.js")

    def test_missing_critical_route_fails(self):
        with self.assertRaises(bundle.BuildHold):
            bundle.select_files(["index.html", "office/index.html"])

    def test_exact_manifest_and_no_source_mutation(self):
        with tempfile.TemporaryDirectory() as d:
            root, out = Path(d) / "source", Path(d) / "publish"
            root.mkdir()
            files = bundle.REQUIRED | {"assets/css/style.css", ".github/workflows/secrets.yml"}
            for filename in files:
                target = root / filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("public " + filename)
            result = bundle.build(root, out, sorted(files), S)
            self.assertEqual(result["source_sha"], S)
            self.assertFalse((out / ".github").exists())
            self.assertTrue((out / "index.html").exists())
            stored = json.loads((out / "_release-manifest.json").read_text())
            self.assertEqual(stored["files"], result["files"])

    def test_disallow_existing_build_path(self):
        with tempfile.TemporaryDirectory() as d:
            root, out = Path(d) / "a", Path(d) / "b"
            root.mkdir()
            out.mkdir()
            with self.assertRaises(bundle.BuildHold):
                bundle.build(root, out, list(bundle.REQUIRED), S)

    def test_disallow_symlinks(self):
        with tempfile.TemporaryDirectory() as d:
            root, out = Path(d) / "source", Path(d) / "out"
            root.mkdir()
            paths = bundle.REQUIRED
            for filename in paths:
                target = root / filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("public")
            (root / "index.html").unlink()
            (root / "index.html").symlink_to(root / "office" / "index.html")
            with self.assertRaises(bundle.BuildHold):
                bundle.build(root, out, list(paths), S)


class WorkflowNoPrematureExecutionTests(unittest.TestCase):
    def test_release_workflow_is_only_manual_and_protected(self):
        path = ROOT / ".github/workflows/tyme-hall-001-controlled-release.yml"
        body = path.read_text()
        self.assertIn("workflow_dispatch:", body)
        self.assertNotIn("\n  push:", body)
        self.assertNotIn("\n  pull_request:", body)
        self.assertIn("tymehall-production", body)
        self.assertIn("TYME_RELEASE_GATE_ARMED", body)
        self.assertIn("TYME_RELEASE_AUTHORIZED_SHA", body)
        self.assertIn("TYME_RELEASE_OPERATOR", body)
        self.assertIn("--commit-hash", body)
        self.assertIn("verify_cloudflare_release_mode.py", body)
        self.assertIn("verify_hall_release_intent.py", body)
        self.assertNotIn("wrangler pages project create", body)
        self.assertNotIn("git push", body)

    def test_draft_has_no_live_secrets(self):
        path = ROOT / ".github/workflows/tyme-hall-001-controlled-release.yml"
        body = path.read_text()
        self.assertNotIn("sk-proj-", body)
        self.assertNotIn("-----BEGIN PRIVATE KEY-----", body)
        self.assertNotIn("curl -X PATCH", body)
        self.assertNotIn("curl -X POST", body)


if __name__ == "__main__":
    unittest.main(verbosity=2)
