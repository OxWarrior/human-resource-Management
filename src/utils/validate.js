/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validMobile(str) {
  return /^13[1-9]\d{9}$/.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassword(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
