export interface CitationData {
  year?: number
  author?: string
  title?: string
  journal?: string
  volume?: number
  number?: number
  pages?: string
  publisher?: string
  url?: string
  doi?: string
  issn?: string
}

// Citation data migrated from slides.md
export const citationsData: Record<string, CitationData> = {
  'tajiri2021': {
    year: 2021,
    author: '田尻 裕貴, 三村 守',
    title: '単語ベースの機械学習モデルによる未知の悪性PowerShellスクリプトの検知手法',
    journal: '情報処理学会論文誌',
    volume: 62,
    number: 5,
    pages: '1317–1327',
    doi: "10.20729/00211105",
    issn: "1882-7764",
    url: "https://ipsj.ixsq.nii.ac.jp/records/211211",
  },
  'mezawa2021': {
    year: 2021,
    author: '目澤 勇樹, 三村 守',
    title: '悪性PowerShell検知のための機械学習モデルに対する回避攻撃の可能性の検証',
    journal: 'コンピュータセキュリティシンポジウム2021論文集',
    pages: '615–622',
    url: "https://ipsj.ixsq.nii.ac.jp/records/214483",
  },
  'mezawa2023': {
    year: 2023,
    author: '目澤 勇樹, 三村 守',
    title: "機械学習を用いた悪性PowerShell検知モデルに対する回避攻撃の影響分析",
    journal: '情報処理学会論文誌',
    volume: 64,
    number: 9,
    pages: '1295-1305',
    issn: "1882-7764",
    doi: "10.20729/00227600",
    url: "https://ipsj.ixsq.nii.ac.jp/records/227709"
  },
  'goodfellow2015': {
    year: 2015,
    author: 'Ian J. Goodfellow, Jonathon Shlens & Christian Szegedy',
    title: 'EXPLAINING AND HARNESSING ADVERSARIAL EXAMPLES',
    doi: "10.48550/arXiv.1412.6572",
    journal: 'arXiv preprint',
    url: "https://arxiv.org/abs/1412.6572",
  },
  'hotflip2018': {
    year: 2018,
    author: 'Javid Ebrahimi, Anyi Rao, Daniel Lowell, Dejing Dou',
    title: 'HotFlip: White-Box Adversarial Examples for Text Classification',
    url: "https://arxiv.org/abs/1712.06751",
    doi: "10.48550/arXiv.1712.06751",
  }
}
