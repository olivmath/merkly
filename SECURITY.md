# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| > 1.3.0 | ✅        |
| 0.8.x   | ❌        |
| 0.7.x   | ❌        |
| 0.6.x   | ❌        |
| 0.5.x   | ❌        |
| 0.4.x   | ❌        |
| < 0.4.x | ❌        |

## Reporting a Vulnerability (v1.3.0)

- [x] The pyCrypto library and its module keccak are no longer actively maintained and have been deprecated.

## Break change (v1.0.0)

- [x] support `merkletreejs`

## Reporting a Vulnerability (v0.8.1)

- [x] pysha3 has deprecated, update to 0.8.1

## Important Note Regarding Deprecation

**[Merkly]** has recently undergone a significant update. We have deprecated the use of the `pysha3` package and replaced it with the more secure and actively maintained `pycryptodome` package, starting from version 0.8.1

This update is essential for maintaining the security and reliability of our library. We strongly encourage all users to upgrade to at least version 0.8.1 or later.

If you are using an older version of the library that depends on `pysha3`, it is no longer supported and may have security vulnerabilities. We recommend updating to the latest version immediately.

We take security seriously, and this update is aimed at providing a safer and more reliable library for our users.

Thank you for your understanding and cooperation.
