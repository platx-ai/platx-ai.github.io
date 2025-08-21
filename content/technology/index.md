---
title: "AI Research"
heading: "Three Tiers of Intelligence"
background: "/images/backgrounds/space-satellite.jpg"
description: "We are a team of AI-native engineers and researchers pushing the boundaries of what's possible with language models."

---

## Our Mission

We are a team of **AI-native engineers and researchers**.

Back when BERT was still a lab experiment, we were already pushing language models to trade the news milliseconds after the headline broke. Today we design and train hybrid-architecture models, curate multimodal data (text, video, timeseries... even LiDAR), and build the curricula that turn raw tokens into reliable intelligence.

### What are we actually chasing?

We see three tiers of "hard" for an LLM. Let $\theta$ be the parameters of a model and $x$, $y$ be the input/output:

<AITierCard tier="1" title="Known Knowledge" description="The model already knows. Most standard chatbots live here—responding from memorized knowledge." formula="y = θ(x)" delay="0" />

<AITierCard tier="2" title="Contextual Reasoning" description="The model can figure it out—if we hand it the right context. Most agentic frameworks and RAG systems fit this description." formula="y = θ(x̃ + x)" delay="200" />

<AITierCard tier="3" title="Adaptive Learning" description="The model itself must change to solve the problem. This is fine-tuning—adapting parameters to new domains or tasks." formula="y = (θ + Δθ)(x)" delay="400" />

This is reminiscent of complexity hierarchies, i.e. $P \subseteq NP \subseteq PSPACE$. And the frontier keeps moving. As models grow stronger, Tier-2 tricks are collapsing into Tier-1 intuition, and Tier-3 retraining is turning into Tier-2 prompting.

We’re here to accelerate that motion until the gaps disappear.

**Close the context gap**: make world fact inferable from the prompt alone.
**Close the training gap**: make new skills learnable in-context.

One token at a time.
