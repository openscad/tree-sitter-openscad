(
  (module_item
    name: (identifier) @local.definition.function
  )
)

(
  (assignment name: (identifier) @local.definition.var)
)

(((parameter) (identifier)) @local.definition.var)

;; reference
(identifier) @local.reference

;; Call references
(
  (module_call
    name: (identifier) @local.reference
  )
  (#set! reference.kind "call")
)

;; Scopes
(module_item) @local.scope
(transform_chain) @local.scope
(union_block) @local.scope
(if_block) @local.scope
(for_block) @local.scope
