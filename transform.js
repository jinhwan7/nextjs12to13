/* transformSomeCode.js */
function transformSomeCode(file, { jscodeshift }) {
  // 1. AST로 파싱
  const tree = jscodeshift(file.source);

  // 2. 수정할 노드 선택
  const nodes = tree.find();

  // 3. 수정
  jscodeshift(nodes).remove();

  // 4. 소스 코드로 내보내기
  return tree.toSource();
}
