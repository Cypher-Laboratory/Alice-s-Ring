# Define directories for the packages
RING_SIG_UTILS_DIR = packages/ring-sig-utils
SAG_TS_DIR = packages/sag-ts
LSAG_TS_DIR = packages/lsag-ts
SAG_EVM_VERIFIER_DIR = packages/sag-evm-verifier
RUST_VERIFIER_DIR = packages/rust-verifier
SNAP_SDK_DIR = packages/metamask-snap/snap-sdk
SNAP_DOCS_DIR = packages/metamask-snap/snap-documentation

# Default target: install dependencies and build everything
.PHONY: all
all: install build

# ------------------ Dependency Installation ------------------
.PHONY: install
install:
	@echo "Installing dependencies..."
	@set -e; \
	yarn install --workspaces

# ------------------ Build Targets ------------------
.PHONY: build
build: build-ring-sig-utils build-ts build-solidity build-rust build-final-log

.PHONY: build-ring-sig-utils
build-ring-sig-utils:
	@echo "Building ring-sig-utils package first..."
	@set -e; \
	cd $(RING_SIG_UTILS_DIR) && yarn build

.PHONY: build-ts
build-ts: build-ring-sig-utils
	@echo "Building TypeScript packages..."
	@set -e; \
	cd $(SAG_TS_DIR) && yarn build & \
	cd $(LSAG_TS_DIR) && yarn build & \
	cd $(SNAP_SDK_DIR) && yarn build & \
	cd $(SNAP_DOCS_DIR) && yarn build & \
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

.PHONY: build-final-log
build-final-log: 
	@echo "All packages built successfully"

# ------------------ Test Targets ------------------
.PHONY: test
test: test-ts test-solidity test-rust

.PHONY: test-ts
test-ts: build-ring-sig-utils
	@echo "Running tests for TypeScript packages..."
	@set -e; \
	cd $(RING_SIG_UTILS_DIR) && yarn test & \
	cd $(SAG_TS_DIR) && yarn test & \
	cd $(LSAG_TS_DIR) && yarn test & \
	cd $(SNAP_SDK_DIR) && yarn test & \
	cd $(SNAP_DOCS_DIR) && yarn test & \
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
fmt-ts: build-ring-sig-utils
	@echo "Formatting TypeScript packages..."
	@set -e; \
	cd $(RING_SIG_UTILS_DIR) && yarn fmt & \
	cd $(SAG_TS_DIR) && yarn fmt & \
	cd $(LSAG_TS_DIR) && yarn fmt & \
	cd $(SNAP_SDK_DIR) && yarn fmt & \
	cd $(SNAP_DOCS_DIR) && yarn fmt & \
	wait

.PHONY: fmt-solidity
fmt-solidity:
	@echo "Formatting Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && yarn fmt

.PHONY: fmt-rust
fmt-rust:
	@echo "Formatting Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo fmt
	@echo "Done formatting Rust package."

.PHONY: fmt-check
fmt-check: fmt-check-ts fmt-check-solidity fmt-check-rust

.PHONY: fmt-check-ts
fmt-check-ts: build-ring-sig-utils
	@echo "Checking format for TypeScript packages..."
	@set -e; \
	cd $(RING_SIG_UTILS_DIR) && yarn fmt:check & \
	cd $(SAG_TS_DIR) && yarn fmt:check & \
	cd $(LSAG_TS_DIR) && yarn fmt:check & \
	cd $(SNAP_SDK_DIR) && yarn fmt:check & \
	cd $(SNAP_DOCS_DIR) && yarn fmt:check & \
	wait

.PHONY: fmt-check-solidity
fmt-check-solidity:
	@echo "Checking format for Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && yarn fmt:check

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
	cd $(RING_SIG_UTILS_DIR) && npm run clean & \
	cd $(SAG_TS_DIR) && npm run clean & \
	cd $(LSAG_TS_DIR) && npm run clean & \
	cd $(SNAP_SDK_DIR) && npm run clean & \
	cd $(SNAP_DOCS_DIR) && npm run clean & \
	wait

.PHONY: clean-solidity
clean-solidity:
	@echo "Cleaning Solidity package..."
	@set -e; \
	cd $(SAG_EVM_VERIFIER_DIR) && npx hardhat clean && npm run clean

.PHONY: clean-rust
clean-rust:
	@echo "Cleaning Rust package..."
	@set -e; \
	cd $(RUST_VERIFIER_DIR) && cargo clean
