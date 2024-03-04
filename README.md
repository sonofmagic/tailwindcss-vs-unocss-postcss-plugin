# tailwindcss-vs-@unocss/postcss

## 前言

我们知道 `unocss` 自称它为什么这么快，是因为它不用去解析抽象语法树，直接通过正则表达式从内容中提取 `token`，然后生成样式。

可是假如我们以 `vite` / `webpack` 插件的方式去使用的话，想要支持 `tailwindcss` 那些 `@apply` , `@screen` , `theme()` 这些指令，

就需要去安装 `@unocss/transformer-directives` 这个 `transformer` 来支持这些功能。

可是这个包其实也是去使用 `css-tree` 去解析抽象语法树的。

也就是说，`unocss` 以 `vite` / `webpack` 插件的方式，去实现的那些 `tailwindcss` `css` 指令不免也要解析成 `AST`，那么这种时候，它又能比 `tailwindcss` 快多少呢？

## 开始测试

这里我做了一个基准测试，`unocss` 只加载 `@unocss/preset-uno` 和 `@unocss/transformer-directives`，`tailwindcss` 为默认安装

测试设备都为 Mac Book M1 (2021):

[源代码链接](https://github.com/sonofmagic/tailwindcss-vs-unocss-postcss-plugin/tree/main/bench)

```
2024/3/4 21:55:03
1656 utilities | x200 runs (75% build time)

none                             16.84 ms / delta.      0.00 ms
unocss       v0.58.5            318.32 ms / delta.    301.47 ms (x1.00)
tailwindcss  v3.4.1             795.13 ms / delta.    778.29 ms (x2.58)
```

可以看到，作为 `vite` 插件使用的 `unocss` 速度差不多是 `tailwindcss` 的 `2.58` 左右。

## postcss 方式

当然，想要支持 `tailwindcss` 的 `@apply` , `@screen` , `theme()` 这些指令，不止这一条路。

我们也可以使用 `@unocss/postcss` 这个 `postcss` 插件去达到这样的目的。

在我看来 `@unocss/postcss` 其实就是一个更加自由，可自定义的 `tailwindcss` 版本，你可以自定义里面匹配和生成规则。

它们实现思路其实还是比较相似的，但是这个世界上没有必要存在 `2` 个 `tailwindcss`。

`unocss` 在多个方面相比来说都更加的进取，而使用 `@unocss/postcss` 这种方式，有点失去了它的一部分灵魂，你知道我指的是哪一部分。

就像我一向的观点，`unocss` 在帮助我们探索更多原子化的上限。

另外我也做了一个同样基于 `postcss` 插件的基准测试，`unocss` 只加载 `@unocss/preset-uno`，[源代码链接](https://github.com/sonofmagic/tailwindcss-vs-unocss-postcss-plugin/tree/main/bench-postcss)

测试结果，不出所料，果然在都需要在解析抽象语法树情况下，它们的性能差距是非常小的：

```
2024/3/4 21:31:47
1656 utilities | x200 runs (75% build time)

none                             14.57 ms / delta.      0.00 ms
unocss       v0.58.5            407.54 ms / delta.    392.97 ms (x1.00)
tailwindcss  v3.4.1             422.24 ms / delta.    407.67 ms (x1.04)

---

windicss(参考) v3.5.6       976.14 ms / delta.    961.57 ms (x2.45)
```

这种情况造成性能的差距，其实就在于，双方引擎中，正则表达式匹配的数量和质量了。所以从上面的测试结果相差的 `15ms` 左右，相差这点已经没有意义了，毕竟我们都知道，正则写的越多执行越慢。

而 `tailwindcss` 和 `unocss` 都可以通过 `plugin` / `preset` 去添加更多的匹配规则。
