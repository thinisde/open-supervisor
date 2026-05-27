# 🎹 Developer's Words

<div align="center">
  <img src="../assets/image.png" alt="Chopin Ballade No.4" width="600" />
</div>

<br />

> *I believe playing the piano is also a form of orchestration.*
>
> *The harmony of polyphony — multiple voices — and homophony — a single melodic line.*
>
> *Each voice sings its most beautiful song from its own place, yet when combined, they create one grand, beautiful melody. I believe this structure is no different from AI agents.*

---

## Control Plane Note

Agent Supervisor is evolving toward a server-first OpenCode control plane: a conductor for many agent voices rather than a single assistant loop.

The current implementation is still an OpenCode plugin, but future work should treat OpenCode server sessions as the runtime substrate for worker agents. Before changing OpenCode SDK or server assumptions, use `docs/opencode/server.mdx` and `docs/opencode/sdk.mdx` as the local source of truth.
