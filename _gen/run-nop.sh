#!/bin/bash
# No-people image batches -> ./out-nop  (Codex gpt-6-sol)
cd "$(dirname "$0")"
B=$1
PROMPT="You are an image production assistant. Use your built-in image generation tool to create EACH image listed below and save each one into the ./out-nop directory with EXACTLY the given filename (PNG). Generate them one by one; if saving is blocked just continue. Respect the aspect ratio. $(cat style-nop.txt)

Format of each line: filename | aspect ratio | subject

$(cat $B)

When done, list for every filename the full path of the generated image file."
codex exec -m gpt-6-sol --skip-git-repo-check --sandbox workspace-write \
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true -c sandbox_workspace_write.exclude_slash_tmp=true \
  "$PROMPT" > log-$B.log 2>&1
echo "DONE $B"
