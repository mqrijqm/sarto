#!/bin/bash
# usage: run-mask.sh batchfile — image EDITS (mermerne maske) via Codex gpt-6-sol
cd "$(dirname "$0")"
B=$1
PROMPT="You are an image production assistant. For EACH line below, use your built-in image generation tool in EDIT mode with the given input file from ./out as the reference image, and produce the edited image. Try to save it into ./out-mask with EXACTLY the given output filename (PNG); if saving is blocked, just continue — do not stop. Process them one by one, all of them.
$(cat mask-style.txt)

Format of each line: output filename | input file | what is in the picture

$(cat $B)

When done, list for every output filename the full path of the generated image file."
codex exec -m gpt-6-sol --skip-git-repo-check --sandbox workspace-write \
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true -c sandbox_workspace_write.exclude_slash_tmp=true \
  "$PROMPT" > log-$B.log 2>&1
echo "DONE $B"
