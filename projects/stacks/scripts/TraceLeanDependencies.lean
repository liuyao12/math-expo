import Lean

open Lean

/-- Export the closure of an elaborated declaration, including generated constructors
and constants in types, bodies, and proofs. One JSON record per declaration. -/
def main (args : List String) : IO Unit := do
  let modules :: roots := args
    | throw (IO.userError "Usage: lean --run TraceLeanDependencies.lean MODULE[,MODULE...] DECLARATION ...")
  if roots.isEmpty then
    throw (IO.userError "Specify at least one root declaration")
  initSearchPath (← findSysroot)
  let imports : Array Import := (modules.splitOn ",").toArray.map fun name => { module := name.toName }
  let env ← importModules imports {} (level := .private)
  let output ← IO.getStdout
  let mut queue := roots.map String.toName |>.toArray
  let mut seen : NameSet := .ofList queue.toList
  let mut next := 0
  while next < queue.size do
    let name := queue[next]!
    next := next + 1
    let some declaration := env.find? name
      | throw (IO.userError s!"Declaration missing from the imported environment: {name}")
    let dependencies := (declaration.getUsedConstantsAsSet.toArray.filter (· != name)).qsort Name.quickLt
    for dependency in dependencies do
      if !seen.contains dependency then
        seen := seen.insert dependency
        queue := queue.push dependency
    output.putStrLn (toJson (name.toString, dependencies.map Name.toString)).compress
