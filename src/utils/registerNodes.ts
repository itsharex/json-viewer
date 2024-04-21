// import G6  from "@antv/g6";
import { computeNodeSize } from './computeNodeSize'
import type { GraphOptionsPlus } from '@/types/graph'

import chroma from "chroma-js";
type bos = boolean | string

function registerNodes(colors,colorValue) {
  const focusColor = ['#00DC82','#2dd4bf'].includes(colorValue) ? colors.amber: '#33BB69'
  const focusColorMap = {
    fill: chroma(focusColor).alpha(0.2).hex(),
    stroke:focusColor,
  } 
  const isDark = useDark()
  const clevels = new Array(10).fill(0).map((_, i) => chroma(colorValue).alpha(i / 10).hex())
  const textColor  = isDark.value ? '#fff': '#333'
  const rectColorMap = {
    stroke: (isHover: bos, isFocus: bos) => isFocus ? focusColorMap.stroke : (isHover ? colorValue : clevels[8] ),
    fill: (isHover: bos, isFocus: bos) => isFocus ? focusColorMap.fill : (isHover ? clevels[3] : clevels[2])
  }
  // 注册根节点
  G6.registerNode(
    'root-icon',
    {
      draw(cfg, group) {
        if (!group)
          return
        group.addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: 30,
            visible: false, // 看不见元素隐藏,提升性能
          },
          name: 'root-bg-shape',
        })
        // 添加图标
        const keyShape = group.addShape('text', {
          attrs: {
            x: 0,
            y: 20,
            fontFamily: 'iconfont',
            textAlign: 'center',
            text: '\uE867',
            fontSize: 50,
            fill: clevels[8] , // 字体图标颜色
            cursor: 'pointer',
          },
          name: 'root-shape',
        })
        // 添加label
        group.addShape('text', {
          attrs: {
            x: 0,
            y: -4,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg?.id,
            fontSize: 14,
            fill: '#fff',
            fontWeight: 'bold',
          },
          name: 'root-label',
        })
        return keyShape
      },
      // 响应状态变化
      setState(name, value, item) {
        const group = item?.getContainer()
        const shape = group?.get('children')[1] // 顺序根据 draw 时确定
        if (name === 'focus') {
          shape.attr('fill', value ? focusColorMap.fill : clevels[8] )
        }
      },
    },
    'circle',
  )
  // 自定义矩形文本节点
  G6.registerNode(
    'flow-rect',
    {
      shapeType: 'flow-rect',
      draw(cfg: any, group) {
        if (!group)
          return
        const { collapsed = true } = cfg as GraphOptionsPlus
        // 计算矩形节点高度
        const [width, height, entriesStr] = computeNodeSize(cfg)
        // 矩形框配置
        const rectConfig = {
          width: width + 20,
          height: height + 20,
          lineWidth: 1,
          fontSize: 12,
          fill:clevels[2], // 设置透明度
          radius: 4,
          stroke: clevels[8] ,
          opacity: 1,
        }

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        }

        const rect = group.addShape('rect', {
          attrs: {
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            ...rectConfig,
          },
        })

        // 文本内容
        group.addShape('text', {
          attrs: {
            textAlign: 'left',
            textBaseline: 'bottom',
            x: nodeOrigin.x + 8,
            y: -nodeOrigin.y - 12,
            text: entriesStr,
            fontSize: 12,
            lineHeight: 12 * 1.5,
            fill: textColor,
            cursor: 'pointer',
            fontFamily: 'Arial',
          } as any,
        })

        // 折叠按钮
        const { id, children = [] } = cfg
        if (children.length) {
          group.addShape('rect', {
            attrs: {
              x: rectConfig.width / 2 - 6,
              y: -6,
              width: 12,
              height: 12,
              stroke: clevels[8],
              cursor: 'pointer',
              fill: clevels[2],
              radius: 2,
            },
            name: 'collapse-back',
            modelId: id,
          })

          // 折叠按钮上的文字
          group.addShape('text', {
            attrs: {
              x: rectConfig.width / 2,
              y: -1,
              textAlign: 'center',
              textBaseline: 'middle',
              text: collapsed ? '+' : '-',
              fontSize: 16,
              cursor: 'pointer',
              fill: clevels[8],
            },
            name: 'collapse-text',
            modelId: id,
          })
        }
        return rect
      },
      setState(name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer()
          const collapseText = group.find(
            e => e.get('name') === 'collapse-text',
          )
          if (collapseText) {
            if (!value)
              collapseText.attr({ text: '-' })
            else
              collapseText.attr({ text: '+' })
          }
        }
        else if (name === 'hover') {
          const group = item.getContainer()
          const shape = group.get('children')[0]
          const isFocus = item.hasState('focus')
          shape.attr('stroke', rectColorMap.stroke(value, isFocus))
          shape.attr('fill', rectColorMap.fill(value, isFocus))
        }
        else if (name === 'focus') {
          const group = item.getContainer()
          const shape = group.get('children')[0]
          shape.attr('stroke', rectColorMap.stroke(false, value))
          shape.attr('fill', rectColorMap.fill(false, value))
        }
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ]
      },
    },
    'rect',
  )
}

export default registerNodes
