# Define directories for the packages
SAG_TS_DIR = packages/sag-ts
LSAG_TS_DIR = packages/lsag-ts
SAG_EVM_VERIFIER_DIR = packages/sag-evm-verifier
RUST_VERIFIER_DIR = packages/rust-verifier

# Default target: build everything
.PHONY: all
all: build

# ------------------ Build Targets ------------------
.PHONY: build
build: build-ts build-solidity build-rust

.PHONY: build-ts
build-ts:
	@echo "Building TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && npm run build & \
	cd $(LSAG_TS_DIR) && npm run build & \
	wait

.PHONY: build-solidity
build-solidity:
	@echo "Building Solidity (Hardhat) package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npx hardhat compile

.PHONY: build-rust
build-rust:
	@echo "Building Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo build

# ------------------ Test Targets ------------------
.PHONY: test
test: test-ts test-solidity test-rust

.PHONY: test-ts
test-ts:
	@echo "Running tests for TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && npm run test & \
	cd $(LSAG_TS_DIR) && npm run test & \
	wait

.PHONY: test-solidity
test-solidity:
	@echo "Running tests for Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npx hardhat test

.PHONY: test-rust
test-rust:
	@echo "Running tests for Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo test

# ------------------ Format Targets ------------------
.PHONY: fmt
fmt: fmt-ts fmt-solidity fmt-rust

.PHONY: fmt-ts
fmt-ts:
	@echo "Formatting TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && npm run fmt & \
	cd $(LSAG_TS_DIR) && npm run fmt & \
	wait

.PHONY: fmt-solidity
fmt-solidity:
	@echo "Formatting Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npm run fmt

.PHONY: fmt-rust
fmt-rust:
	@echo "Formatting Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo fmt

.PHONY: fmt-check
fmt-check: fmt-check-ts fmt-check-solidity fmt-check-rust

.PHONY: fmt-check-ts
fmt-check-ts:
	@echo "Checking format for TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && npm run fmt:check & \
	cd $(LSAG_TS_DIR) && npm run fmt:check & \
	wait

.PHONY: fmt-check-solidity
fmt-check-solidity:
	@echo "Checking format for Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npm run fmt:check

.PHONY: fmt-check-rust
fmt-check-rust:
	@echo "Checking format for Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo fmt -- --check

# ------------------ Clean Targets ------------------
.PHONY: clean
clean: clean-ts clean-solidity clean-rust

.PHONY: clean-ts
clean-ts:
	@echo "Cleaning TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && npm run clean & \
	cd $(LSAG_TS_DIR) && npm run clean & \
	wait

.PHONY: clean-solidity
clean-solidity:
	@echo "Cleaning Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npx hardhat clean

.PHONY: clean-rust
clean-rust:
	@echo "Cleaning Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo clean
