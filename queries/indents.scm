[
  (module_item)
  (union_block)
  (if_block)
  (for_block)
] @indent.begin

[
  "}"
  ")"
] @indent.end

(arguments ")" @indent.branch)
(parameters ")" @indent.branch)

[(line_comment) (block_comment)] @indent.ignore
