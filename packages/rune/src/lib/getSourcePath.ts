import path from "path"

// assume the source path is underneath the distribution location
export function getSourcePath(gameDir: string): string {
  return `${gameDir.substring(0, gameDir.lastIndexOf(path.sep) + 1)}src`
}
