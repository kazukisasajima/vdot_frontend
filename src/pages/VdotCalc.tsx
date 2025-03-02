import React from 'react'
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const VdotCalc = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">VDOT計算</h2>
        <p className="text-lg text-gray-700">
          VDOT計算ページです。
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">距離</label>
          <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">タイム</label>
          <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" />
        </div>
        <div className="mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">計算</button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default VdotCalc