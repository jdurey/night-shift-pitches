#!/bin/bash
osascript -e '
tell application "Mail"
    set newMessage to make new outgoing message with properties {subject:"vimi Knowledge Architecture", content:"Subject: Vimi's Knowledge Architecture\r\rHi [Founder Name],\r\rI've been following Vimi's growth. Your seed round is a massive signal that the market is ready for K-12 math tutors that actually adapt to school curricula.\r\rHowever, true adaptivity usually requires a rigorously sequenced knowledge spine and misconception-triggered interventions. Without a solid, evidence-grounded misconception substrate, \"adaptive\" models can sometimes default to generic hints rather than precise routing.\r\rI recently built an evidence-grounded K-8 misconception bank harvested from released assessment data. To show you what this looks like in practice, I built a quick architectural mockup showing how I'd test the sequencing layer for Vimi:\rhttps://jdurey.github.io/night-shift-pitches/#/p/vimi\r\rThis misconception layer is often what turns a generic LLM tutor into a rigorous instructional engine. I'd love to hear your thoughts and chat about how you're approaching this layer as you scale.\r\rBest,\rJosh\r", visible:true}
    tell newMessage to make new to recipient at end of to recipients with properties {address:"founder@vimi.com"}
    activate
end tell
'
