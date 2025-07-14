# Slidev Theme GTlabo

[![NPM version](https://img.shields.io/npm/v/slidev-theme-gtlabo?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-theme-gtlabo)

学術発表やプレゼンテーション用に設計されたSlidev用カスタムテーマ。引用管理、数式表示、階層リストなどの機能を提供します。

## Install

```bash
npm install slidev-theme-gtlabo
```
Add the following frontmatter to your `slides.md`. Start Slidev then it will prompt you to install the theme automatically.

<pre><code>
---
theme: <b>slidev-theme-gtlabo</b>
---
</code></pre>

Learn more about [how to use a theme](https://sli.dev/guide/theme-addon#use-theme).

## Layouts

This theme provides the following layouts:

> TODO:

## Components

このテーマは以下のコンポーネントを提供します：

### 1. Citation コンポーネント
インライン引用と参考文献の管理を行います。

```vue
<Citation id="reference-key" />
```

**機能:**
- インライン引用番号の表示（`[1]`形式）
- 画面下部に現在のページの引用情報を表示
- 引用番号の自動管理
- 複数ページにわたる引用の追跡

**使用例:**
```markdown
この技術について<Citation id="smith2023" />の研究が参考になります。
```

### 2. CitationListPage コンポーネント
参考文献一覧ページを生成します。

```vue
<CitationListPage />
```

**機能:**
- 全ての参考文献を一覧表示
- 学術スタイルでの引用フォーマット
- DOI、URL、ISSN等の情報表示
- ソート機能（キー、著者、年別）

**プロパティ:**
- `style`: 引用スタイル（`academic`、`ieee`、`apa`）
- `sortBy`: ソート基準（`key`、`author`、`year`）

### 3. Header コンポーネント
プレゼンテーションのヘッダー部分を管理します。

```vue
<Header 
  :chapter-data="{ title: 'セクションタイトル' }"
  chapter="section1"
  current-section="intro"
/>
```

**機能:**
- 章・セクションの進捗表示
- 現在位置の可視化
- ページ番号表示
- 動的なプログレスバー

**プロパティ:**
- `chapter`: 章のキー
- `chapterData`: 章の情報オブジェクト
- `currentSection`: 現在のセクション
- `currentChapter`: 現在の章


### 4. MathText コンポーネント
数式とテキストを統合表示します。

```vue
<MathText 
  text="これは数式 $x^2 + y^2 = z^2$ を含むテキストです。"
  container-tag="p"
  :simple="false"
  :disable-markdown="false"
/>
```

**機能:**
- LaTeX数式の自動レンダリング
- インライン数式（`$...$`）とブロック数式（`$$...$$`）
- Markdownサポート（太字、イタリック、リンク等）
- KaTeX による数式描画
- シンプルモード対応

**プロパティ:**
- `text`: 表示するテキスト
- `containerTag`: コンテナのHTMLタグ
- `simple`: シンプルモード（基本的な数式のみ）
- `disableMarkdown`: Markdownを無効化
- `customDelimiters`: カスタム区切り文字

### 5. SectionTitle コンポーネント
セクションタイトルを表示します。

```vue
<SectionTitle 
  title="セクションタイトル"
  color="sky-800"
/>
```

**機能:**
- 左側のカラーバーと組み合わせたタイトル表示
- UnoCSS/Tailwindカラー対応
- カスタムカラー対応
- スロットコンテンツ対応

**プロパティ:**
- `title`: タイトルテキスト
- `color`: カラー（Tailwind形式またはHEX）

### 6. SubSectionTitle コンポーネント
サブセクションタイトルを表示します。

```vue
<SubSectionTitle 
  title="サブセクションタイトル"
  color="sky-700"
/>
```

**機能:**
- 左側のアイコン（矢印）と組み合わせたタイトル表示
- UnoCSS/Tailwindカラー対応
- カスタムカラー対応

**プロパティ:**
- `title`: タイトルテキスト
- `color`: カラー（Tailwind形式またはHEX）

### 7. TextColorBox コンポーネント
色付きのテキストボックスを表示します。

```vue
<TextColorBox 
  title="タイトル"
  text="本文テキスト"
  container-class="my-4"
/>
```

**機能:**
- タイトル付きのカラーボックス
- HTMLタグ対応
- マーキング機能（`v-mark`）
- カスタムスタイル適用

**プロパティ:**
- `title`: ボックスのタイトル
- `text`: ボックスの本文
- `containerClass`: 追加のCSSクラス


**機能:**
- SVGベースの入れ子円グラフ
- データ構造の階層表示
- アニメーション効果
- 課題提起セクション付き
- パーセンテージ表示

**特徴:**
- 外側の円：全体データの分類（構造化/非構造化）
- 内側の円：構造化データの詳細分類
- 自動アニメーション効果
- 完全にカスタマイズ可能なSVG

### 8. bib2slidev
`bib2slidev`は、BibTeX形式の参考文献をSlidev用の引用形式に変換するツールです。
Pythonで実装されています。
`dev/bib2slidev.ipynb`を参照してください。

## 🛠️ 設定方法

### 1. 参考文献の設定

frontmatter に `citations` を追加：

```yaml
---
citations:
  smith2023:
    author: "Smith, J."
    title: "Research on AI"
    journal: "Journal of AI"
    year: "2023"
    doi: "10.1000/example"
  jones2022:
    author: "Jones, A."
    title: "Machine Learning Basics"
    publisher: "Tech Press"
    year: "2022"
---
```

### 2. 章・セクション構造の設定

```yaml
---
chapters:
  intro:
    title: "はじめに"
    sections:
      overview:
        title: "概要"
      objectives:
        title: "目的"
  method:
    title: "手法"
    sections:
      approach:
        title: "アプローチ"
      implementation:
        title: "実装"
---
```

## 📱 使用例

```vue
<template>
  <div>
    <!-- ヘッダー -->
    <Header 
      :chapter-data="{ title: '研究手法' }"
      chapter="method"
      current-section="approach"
    />
    
    <!-- セクションタイトル -->
    <SectionTitle title="提案手法" />
    
    <!-- 数式を含むテキスト -->
    <MathText 
      text="提案手法では、損失関数 $L = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y_i})^2$ を最小化します。"
    />
    
    <!-- 階層リスト -->
    <HierarchyList>
      - 手法の特徴
        - 高精度
        - 高速処理
        - 省メモリ
    </HierarchyList>
    
    <!-- 引用 -->
    <p>この手法は<Citation id="smith2023" />で提案されました。</p>
    
    <!-- カラーボックス -->
    <TextColorBox 
      title="重要なポイント"
      text="この手法により従来手法より<strong>20%</strong>の性能向上を実現しました。"
    />
  </div>
</template>
```

## 🎨 スタイル

テーマは以下のカラーパレットを使用：
- プライマリ: Sky（`sky-600`、`sky-700`、`sky-800`）
- セカンダリ: Gray（`gray-600`、`gray-700`、`gray-800`）
- アクセント: Blue（`blue-500`、`blue-600`）

## 📦 依存関係

- Vue 3
- Slidev
- UnoCSS/Tailwind CSS
- KaTeX（数式レンダリング）
- Lucide Icons

## Contributing

- `npm install`
- `npm run dev` to start theme preview of `example.md`
- Edit the `example.md` and style to see the changes
- `npm run export` to generate the preview PDF
- `npm run screenshot` to generate the preview PNG
