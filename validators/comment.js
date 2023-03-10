function commentValidator(ctx) {
  ctx
    .validateBody("nickname")
    .required("评论人名字 nickname不能为空")
    .isString()
    .trim();
  ctx
    .validateBody("content")
    .required("评论内容 content不能为空")
    .isString()
    .trim();
  ctx
    .validateBody("art_id")
    .required("目标art_id不能为空")
    .isString()
    .trim();
}
module.exports = {
  commentValidator,
};
