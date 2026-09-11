/**
 * Real inference data from RoboAlign-Judge
 * (Qwen3-VL-8B-Thinking + LoRA, 5-run mean ± std)
 *
 * Each case contains:
 *   instruction   : natural-language task prompt
 *   initialImage  : starting frame (static image)
 *   videos        : {wan: ..., digr (RoboAlign-R1): ...}
 *   reasoning     : model's raw chain-of-thought output (excerpt)
 *   scores        : 5-run mean + std per dimension
 */
window.JUDGE_CASES = {
  caseA: {
    id: "caseA",
    title: "Case A — drawer manipulation",
    instruction: "pick orange can from bottom drawer and place on counter",
    initialImage: "static/judge/case_a_initial.jpg",
    entries: [
      {
        key: "wan",
        name: "Wan2.2-TI2V-5B (LoRA)",
        color: "#c87032",
        video: "static/judge/case_a_wan.mp4",
        reasoning:
`Let me analyze this video carefully.

**Instruction:** "pick orange can from bottom drawer and place on counter"

Looking at the initial frame and the generated video frames, I observe temporal inconsistencies with frames appearing in a shuffled order. The video shows moderate quality with several noticeable issues.

Now let me score each dimension:

**1. Instruction Following:** The robot partially follows the instruction — the gripper approaches the drawer but the retrieval of the can is not crisp.  →  2 / 3
**2. Manipulation Success:** The task is partially completed; the can is lifted but not cleanly placed.  →  1 / 2
**3. Action–Outcome Consistency:** Some robot motions do not produce the expected frame change.  →  0 / 1
**4. Temporal Consistency:** Visible shuffled segments and mild flicker.  →  0 / 1
**5. Contact Realism:** Gripper–can contacts look natural.  →  1 / 1
**6. Physics Adherence:** The video mostly obeys physics.  →  1 / 2`,
        scores: {
          instr:   { mean: 2.6, std: 0.49, max: 3 },
          manip:   { mean: 1.6, std: 0.49, max: 2 },
          actout:  { mean: 0.8, std: 0.40, max: 1 },
          temp:    { mean: 0.2, std: 0.40, max: 1 },
          contact: { mean: 1.0, std: 0.00, max: 1 },
          phys:    { mean: 1.2, std: 0.40, max: 2 },
          total:   { mean: 7.4, std: 1.62, max: 10 }
        }
      },
      {
        key: "digr",
        name: "RoboAlign-R1 (ours)",
        color: "#1a4f8b",
        video: "static/judge/case_a_digr.mp4",
        reasoning:
`Let me analyze this video carefully.

**Instruction:** "pick orange can from bottom drawer and place on counter"

The generated rollout shows a full trajectory: the gripper descends to the drawer, grasps the orange can, lifts it up and smoothly places it on the counter. Textures stay sharp and contacts are realistic throughout the horizon.

Now let me score each dimension:

**1. Instruction Following:** The robot correctly executes the drawer-to-counter transfer.  →  3 / 3
**2. Manipulation Success:** The can is firmly placed on the counter at the end.  →  2 / 2
**3. Action–Outcome Consistency:** Each motion produces the expected frame change.  →  1 / 1
**4. Temporal Consistency:** Smooth frame-to-frame transitions without flicker.  →  1 / 1
**5. Contact Realism:** Gripper–can and can–counter contacts are physically plausible.  →  1 / 1
**6. Physics Adherence:** The entire trajectory obeys physics.  →  2 / 2`,
        scores: {
          instr:   { mean: 3.0, std: 0.00, max: 3 },
          manip:   { mean: 2.0, std: 0.00, max: 2 },
          actout:  { mean: 1.0, std: 0.00, max: 1 },
          temp:    { mean: 1.0, std: 0.00, max: 1 },
          contact: { mean: 1.0, std: 0.00, max: 1 },
          phys:    { mean: 2.0, std: 0.00, max: 2 },
          total:   { mean: 10.0, std: 0.00, max: 10 }
        }
      }
    ]
  },

  caseB: {
    id: "caseB",
    title: "Case B — tabletop object placement",
    instruction: "move water bottle near rxbar blueberry",
    initialImage: "static/judge/case_b_initial.jpg",
    entries: [
      {
        key: "wan",
        name: "Wan2.2-TI2V-5B (LoRA)",
        color: "#c87032",
        video: "static/judge/case_b_wan.mp4",
        reasoning:
`Let me analyze this video carefully.

**Instruction:** "move water bottle near rxbar blueberry"

The video ends prematurely before the task is completed. Frames appear in a partially shuffled order, and the bottle barely moves. Overall quality is poor with significant issues across multiple dimensions.

Now let me score each dimension:

**1. Instruction Following:** The robot vaguely attempts the instruction but the trajectory is incomplete.  →  1 / 3
**2. Manipulation Success:** The bottle is not placed near the rxbar.  →  0 / 2
**3. Action–Outcome Consistency:** Actions and observed outcomes do not match.  →  0 / 1
**4. Temporal Consistency:** Visible shuffling and truncation.  →  0 / 1
**5. Contact Realism:** Brief contacts look natural.  →  1 / 1
**6. Physics Adherence:** Several violations but not severe.  →  0 / 2`,
        scores: {
          instr:   { mean: 1.2, std: 0.40, max: 3 },
          manip:   { mean: 0.4, std: 0.49, max: 2 },
          actout:  { mean: 0.2, std: 0.40, max: 1 },
          temp:    { mean: 0.0, std: 0.00, max: 1 },
          contact: { mean: 1.0, std: 0.00, max: 1 },
          phys:    { mean: 0.6, std: 0.49, max: 2 },
          total:   { mean: 3.4, std: 1.20, max: 10 }
        }
      },
      {
        key: "digr",
        name: "RoboAlign-R1 (ours)",
        color: "#1a4f8b",
        video: "static/judge/case_b_digr.mp4",
        reasoning:
`Let me analyze this video carefully.

**Instruction:** "move water bottle near rxbar blueberry"

The gripper approaches the water bottle, grasps it, translates it smoothly across the table and releases it right next to the rxbar blueberry. The horizon is consistent and textures remain sharp.

Now let me score each dimension:

**1. Instruction Following:** Correct translation to the target landmark.  →  3 / 3
**2. Manipulation Success:** Bottle ends up adjacent to the rxbar.  →  2 / 2
**3. Action–Outcome Consistency:** Each gripper motion produces the right frame change.  →  1 / 1
**4. Temporal Consistency:** Smooth motion without jumps.  →  1 / 1
**5. Contact Realism:** Plausible grasp and release.  →  1 / 1
**6. Physics Adherence:** No visible violations.  →  2 / 2`,
        scores: {
          instr:   { mean: 2.8, std: 0.40, max: 3 },
          manip:   { mean: 1.8, std: 0.40, max: 2 },
          actout:  { mean: 1.0, std: 0.00, max: 1 },
          temp:    { mean: 0.8, std: 0.40, max: 1 },
          contact: { mean: 1.0, std: 0.00, max: 1 },
          phys:    { mean: 1.8, std: 0.40, max: 2 },
          total:   { mean: 9.2, std: 1.17, max: 10 }
        }
      }
    ]
  }
};

/** Six evaluation dimensions (order matters for display). */
window.JUDGE_DIMS = [
  { key: "instr",   label: "Instruction Following",     max: 3, icon: "fa-message" },
  { key: "manip",   label: "Manipulation Success",      max: 2, icon: "fa-hand-back-fist" },
  { key: "actout",  label: "Action-Outcome Consistency", max: 1, icon: "fa-link" },
  { key: "temp",    label: "Temporal Consistency",      max: 1, icon: "fa-clock" },
  { key: "contact", label: "Contact Realism",           max: 1, icon: "fa-hand-pointer" },
  { key: "phys",    label: "Physics Adherence",         max: 2, icon: "fa-atom" }
];
