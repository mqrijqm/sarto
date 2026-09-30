#!/bin/bash
# Depth mape za skulpture (image edit) — gpt-6-sol
cd "$(dirname "$0")"
PROMPT="You are an image production assistant. For EACH of these input images in ./out: sculpt-single.png, sculpt-double.png — use your built-in image generation tool in EDIT mode with that image as the reference input, and produce its DEPTH MAP: identical framing, identical size and identical silhouette position (pixel-aligned with the input), grayscale only, the parts of the sculpture closest to the camera are bright white, parts further away progressively darker grey, smooth soft gradients that follow the 3D volume of the jacket, sleeves, trousers and shoes, and the entire background pure black (#000000). No texture detail, no text, no lighting shading — only distance. Save them into ./out as depth-single.png, depth-double.png (PNG). When done, list the files with their pixel dimensions. Do not create any other files."
codex exec -m gpt-6-sol --skip-git-repo-check --sandbox workspace-write \
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true -c sandbox_workspace_write.exclude_slash_tmp=true \
  "$PROMPT" > log-depth.log 2>&1
echo "DONE depth"
