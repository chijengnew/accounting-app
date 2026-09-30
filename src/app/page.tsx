import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
          <h1>React 練習專案</h1>
      </header>
      <section className="banner">
        <p>歡迎光臨我的頁面</p>
      </section>
      <div className="center">
        <Link href="/accounting" className="btn">點此開始</Link>
      </div>
    </main>
  );
}