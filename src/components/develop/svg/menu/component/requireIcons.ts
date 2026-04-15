// 获取所有 SVG 文件
const modules = import.meta.glob('@/assets/icons/svg/*.svg', {
    eager: true,
    as: 'url',
})

const re = /\/([^/]+)\.svg$/

const icons: string[] = Object.keys(modules)
    .map((path: string) => {
        const match = path.match(re)
        return match ? match[1] : ''
    })
    .filter(Boolean)

export default icons
