# TYME Provider Attestation Probe

One-use synthetic-provider test harness for `TYME-PROVIDER-ATTESTATION-001`.

It validates:

- trusted provider root enrollment;
- provider-signed participant-key attestation;
- provider key rotation;
- attestation revocation;
- participant key rotation;
- stale-attestation non-transfer;
- fresh attestation on the rotated participant key;
- provider signing-key revocation;
- identity downgrade to cryptographic-only;
- no authority promotion.

The provider identity is synthetic. A PASS proves the mechanism only.
