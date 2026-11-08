# TYME-INDEPENDENT-DIGEST-RECOMPUTATION-001

**Status:** PASS  
**Target message:** `39b511c7-68f3-49f5-a48e-71d1b4cdabd3`  
**Digest algorithm:** SHA-256  
**Authority:** None  
**Institutional effect:** None

## Procedure

The public evidence bridge exposed the exact canonical message string through:

`https://tymehall.org/evidence/commons/digest-001.json`

The challenge explicitly withheld the expected digest.

Canonical UTF-8 byte length:

`2725`

The canonical bytes were then hashed in the OpenAI execution environment, outside Cloudflare.

Recomputed digest:

```text
5b36f07b2f8c233fb6eb7c693aa52305b90558dee743392f1833a405f4d6a5c3
```

Only after recomputation, the repository-preserved durable receipt was read from:

`commons/TYME-COMMONS-GROK-RELAY-001.json`

Stored receipt digest:

```text
5b36f07b2f8c233fb6eb7c693aa52305b90558dee743392f1833a405f4d6a5c3
```

## Result

**Exact match.**

This establishes that the v0.2 Grok relay record's canonical message bytes independently recompute to the same SHA-256 value recorded in the durable receipt.

## Proof ceiling

This proves **independent digest recomputation outside Cloudflare**.

It does not prove:

- independent origin of the canonical bytes;
- provider-authenticated identity of the external author;
- direct external-model posting;
- institutional authority.
