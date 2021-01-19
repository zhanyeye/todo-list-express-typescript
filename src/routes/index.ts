import { Router, Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

const router: Router = Router();

// __dirname:总是指向被执行js 文件的绝对路径
const normalizedPath: string = path.join(__dirname);

// 定义todo数组类型
let todos: { name: string, id: number, fav: boolean }[] = []
let counter = 1

// 挂载/routres目录下的其他中间件路由
fs.readdirSync(normalizedPath).forEach(file => {
    if (file.includes(".routes.") && !file.includes("index.")) {
        router.use("/", require(`./${file}`).router);
    }
});

// 获取所有todo
router.get('/todo/list', (req, res) => {
    res.json({
        isOk: true,
        errMsg: '',
        data: todos,
    })
})

// 添加todo
router.put('/todo', (req, res) => {
    const { name } = req.body
    todos.push({ name, id: counter++, fav: false })
    res.json({
        isOk: true,
    })
})

// 删除todo
router.delete('/todo', (req, res) => {
    const { id } = req.body
    todos = todos.filter(x => x.id !== id)
    res.json({
        isOk: true,
    })
})

// 收藏/取消收藏todo
router.post('/todo/fav', (req, res) => {
    const { id } = req.body
    todos = todos.map(x => {
        if (x.id === id) {
            return ({ ...x, fav: !x.fav })
        } else {
            return x
        }
    })
    res.json({
        isOk: true,
    })
})

export default router;
