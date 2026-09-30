#!/bin/bash
# usage: run.sh batchfile  — generates images via Codex (gpt-6-sol, NOT astra)
cd "$(dirname "$0")"
B=$1
PROMPT="You are an image production assistant. Use your built-in image generation tool to create EACH image listed below and save each one into the ./out directory with EXACTLY the given filename (PNG). Generate them one by one. Respect the aspect ratio as closely as the tool allows. $(cat style.txt)

Format of each line: filename | aspect ratio | subject

$(cat $B)

When done, list the files you saved with their pixel dimensions. Do not create any other files."
codex exec -m gpt-6-sol --skip-git-repo-check --sandbox workspace-write \
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true -c sandbox_workspace_write.exclude_slash_tmp=true \
  "$PROMPT" > log-$B.log 2>&1
echo "DONE $B"
