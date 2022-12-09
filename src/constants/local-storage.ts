/**
 * 本地缓存相关常量
 * @anchor SuperYing
 * @date 2022/12/05 19:29:54
 */
// 权限相关缓存key
export const AUTH = {
  TOKEN: 'authorization', // token 缓存key
  TOKEN_EXPIRES: 'token_expires', // 权限token过期时间缓存key
  TOKEN_COMPLETE_RESULT: 'token', // token 请求返回的完整响应结构缓存key
  TOKEN_REFRESH_EXPIRES: 'refreshToken_expiration' // token 刷新有效期缓存key
}
