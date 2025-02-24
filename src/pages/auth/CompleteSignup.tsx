import React from 'react'

const CompleteSignup = () => {
  return (
    <div className="max-w-[400px] m-auto text-center">
    <div className="text-2xl font-bold mb-10">本登録完了</div>
    <div>アカウント本登録が完了しました</div>
    <button className="bg-blue-500 text-white py-2 px-4 rounded">
      <a href="/login">ログイン</a>
    </button>
  </div>
  )
}

export default CompleteSignup