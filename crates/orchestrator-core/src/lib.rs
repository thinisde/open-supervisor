//! Agent Supervisor core library
//!
//! This crate provides the core logic for the Agent Supervisor plugin runtime,
//! including hooks, tools, and configuration handling.
//!
//! # Architecture
//!
//! ```text
//! ┌─────────────────────────────────────────────────────────┐
//! │                    orchestrator-core                    │
//! ├─────────────────────────────────────────────────────────┤
//! │  hooks/      - Pre/Post tool execution hooks           │
//! │  tools/      - Tool implementations (LSP, grep, etc)    │
//! │  config/     - Configuration loading and validation     │
//! └─────────────────────────────────────────────────────────┘
//! ```

pub mod config;
pub mod constants;
pub mod error;
pub mod hooks;
pub mod tools;

pub use config::OrchestratorConfig;
pub use error::{Error, Result};
