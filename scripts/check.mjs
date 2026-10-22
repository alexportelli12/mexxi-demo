// Cheap static checks: every JS file parses and every page links its stylesheet.
import { readdir, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const problems = [];
for (const dir of ["lib", "public", "scripts", "test", "."]) {
  for (const name of await readdir(dir)) {
    const file = `${dir}/${name}`;
    if (/\.m?js$/.test(name)) {
      try {
        execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
      } catch (error) {
        problems.push(`${file}: ${error.stderr}`);
      }
    }
    if (name.endsWith(".html") && !(await readFile(file, "utf8")).includes('href="/app.css"')) problems.push(`${file}: missing app.css`);
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("check: ok");
