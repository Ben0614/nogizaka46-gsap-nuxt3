export default defineNuxtRouteMiddleware(() => {
  // 如果從其他頁非頂部跳轉 到新頁面的scrollY會跟前一頁一樣
  // 這會造成scrollTrigger start end產生問題
  // 所以要跳回頁面的頂部 (這裡主要是處理頁面間跳動的)
  if (process.client) {
    window.scrollTo(0, 0)
  }
})
