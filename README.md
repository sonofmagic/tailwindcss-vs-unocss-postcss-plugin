# unocss 究竟比 tailwindcss 快多少？

## 前言

我们知道 `unocss` 很快，也许是目前最快的原子化 `CSS` 引擎 (没有之一)。

它自称它为什么这么快，是因为它不用去解析抽象语法树，直接通过正则表达式从内容中提取 `token`，然后生成样式。

这点从 `unocss` 官方提供目前最新的测试结果可以看到（2023-08-11）:

```
11/8/2023, 3:53:41 PM
1656 utilities | x200 runs (75% build time)

none                             33.99 ms / delta.      0.00 ms
unocss       v0.57.2            359.46 ms / delta.    325.47 ms (x1.00)
tailwindcss  v3.3.5            1238.25 ms / delta.   1204.26 ms (x3.70)
windicss     v3.5.6            1742.45 ms / delta.   1708.46 ms (x5.25)
```

可以看到 `unocss` 比 `tailwindcss` 快 `3.7` 倍左右，其中官方的测试素材使用的是 `@unocss/vite`。

可是假如我们以 `vite` / `webpack` 插件的方式去使用 `unocss` 的话，默认是不支持 `tailwindcss` 那些 `@apply` , `@screen` , `theme()` 这些指令的。

这时候我们就需要额外去安装 `@unocss/transformer-directives` 这个包来支持这些功能。

可是这个包其实也是去使用 `css-tree` 去解析抽象语法树的。

也就是说，`unocss` 以 `vite` / `webpack` 插件的方式，去实现的那些 `tailwindcss` `css` 指令不免也要解析成 `AST`，那么这种时候，它又能比 `tailwindcss` 快多少呢？

## 开始测试

这里我做了一个基准测试，`unocss` 只加载 `@unocss/preset-uno` 和 `@unocss/transformer-directives`，`tailwindcss` 为默认安装

测试素材以及代码 `fork` 自 `unocss` 官方 `bench`，同时为了模拟平常的开发场景，我还加入了等量的 `@apply` 指令，这样它们都免不了要去解析 `CSS` 抽象语法树。测试设备都为 Mac Book M1 (2021):

[源代码链接](https://github.com/sonofmagic/tailwindcss-vs-unocss-postcss-plugin/tree/main/bench)

```
2024/3/5 00:19:14
1656 utilities | x200 runs (75% build time)

none                             19.92 ms / delta.      0.00 ms 
unocss       v0.58.5            328.39 ms / delta.    308.47 ms (x1.00)
tailwindcss  v3.4.1             798.42 ms / delta.    778.49 ms (x2.52)
```

可以看到，作为 `vite` 插件使用的 `unocss` 速度差不多是 `tailwindcss` 的 `2.52` 倍左右。

可见 `CSS` 抽象语法树的解析，还是显著的降低了 `unocss` 的速度，不过成绩依然是可喜的，非常厉害。

## postcss 方式

当然，想要支持 `tailwindcss` 的 `@apply` , `@screen` , `theme()` 这些指令，不止这一条路。

我们也可以使用 `@unocss/postcss` 这个 `postcss` 插件去达到这样的目的。

在我看来 `@unocss/postcss` 其实就是一个更加自由，可自定义的 `tailwindcss` 版本，你可以自定义里面匹配和生成 `CSS` 的规则。

这 `2` 个库，其实实现思路其实还是比较相似的，但是这个世界上，并没有必要存在 `2` 个 `tailwindcss`。

`unocss` 在多个方面相比来说都更加的进取，而使用 `@unocss/postcss` 这种方式，相比它推荐的使用方式来说，有一点点失去了它的一部分灵魂，你知道我指的是哪一部分（笑～）。

就像我一向的观点，`unocss` 在帮助我们探索原子化更多的上限。

另外我也做了一个同样基于 `postcss` 插件的基准测试，`unocss` 只加载 `@unocss/preset-uno`，测试环境也和上一个一样。

[源代码链接](https://github.com/sonofmagic/tailwindcss-vs-unocss-postcss-plugin/tree/main/bench-postcss)

测试结果如下:

```
2024/3/4 21:31:47
1656 utilities | x200 runs (75% build time)

none                             14.57 ms / delta.      0.00 ms
unocss       v0.58.5            407.54 ms / delta.    392.97 ms (x1.00)
tailwindcss  v3.4.1             422.24 ms / delta.    407.67 ms (x1.04)

---

windicss(参考) v3.5.6       976.14 ms / delta.    961.57 ms (x2.45)
```

不出所料，果然在都需要在解析抽象语法树情况下，它们的性能差距是非常小的。因为大家操纵 `CSS AST` 的方式和手段都是差不多的，这点上不会有什么差距。

而相差的那 `15ms` 左右，其实关键点就在于，双方引擎中，正则表达式匹配的数量和质量了。但是，相差这点时间其实已经没有意义了，毕竟我们都知道，正则写的越多，越复杂，执行就越慢。

而 `tailwindcss` 和 `unocss` 都可以通过 `plugin` / `preset` 去添加更多的匹配规则。
