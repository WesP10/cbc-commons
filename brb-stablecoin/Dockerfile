# BRB Stablecoin Development Environment
# Stable versions: Solana 1.18.26, Anchor 0.29.0, Rust 1.78.0

FROM ubuntu:22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libudev-dev \
    llvm \
    libclang-dev \
    protobuf-compiler \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

# Set up user (non-root for security)
RUN useradd -m -s /bin/bash solana
USER solana
WORKDIR /home/solana

# Install Rust 1.78.0 (compatible with Solana 1.18.26 and modern dependencies)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.78.0

# Update PATH to include Cargo
ENV PATH="/home/solana/.cargo/bin:${PATH}"

# Install Solana CLI 1.18.26 (prebuilt binary)
RUN curl -sSfL "https://github.com/solana-labs/solana/releases/download/v1.18.26/solana-release-x86_64-unknown-linux-gnu.tar.bz2" | tar jxf - && \
    mkdir -p /home/solana/.local/share/solana/install && \
    mv solana-release /home/solana/.local/share/solana/install/active_release && \
    /home/solana/.local/share/solana/install/active_release/bin/solana --version

# Add Solana to PATH
ENV PATH="/home/solana/.local/share/solana/install/active_release/bin:${PATH}"

# Anchor CLI 0.28.0 (fully compatible with Solana 1.18.x and Rust 1.75)
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v0.28.0 anchor-cli --locked

# Create Solana config directory
RUN mkdir -p /home/solana/.config/solana

# Ensure proper ownership of cache directories
RUN mkdir -p /home/solana/.cache/solana && \
    chown -R solana:solana /home/solana/.cache

# Create workspace directory
WORKDIR /workspace

# Verify installations
RUN echo "=== Installation Verification ===" && \
    rustc --version && \
    cargo --version && \
    anchor --version && \
    node --version && \
    npm --version

# Note: Solana config will be set on first container run
# This avoids PATH issues during build

# Default command
CMD ["/bin/bash"]
