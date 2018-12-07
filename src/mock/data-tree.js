import _ from 'lodash'
var mockTreeNodes = [
  {
    type: 'product',
    id: 1,
    title: '有道精品课',
    visible_perms: ['ke_general'], // product的perms是“可见”权限，有该权限则所有子节点可见
    currentUserVisible: true, //  （后端计算出的属性）当前用户是否有“可见”权限
    containsExecutableForCurrentUser: true, // （后端计算出的属性）本节点或其子孙节点是否含有当前用户可执行的叶子节点
    creator: 'bob', // 创建者
    children: [
      {
        type: 'folder',
        id: 15,
        title: '链接',
        currentUserExecutable: true,
        computed_executable_perms: ['ke_general'], // （后端计算出的属性，如果没有配置，会直接拷贝product的visible_perms）folder的perms是“执行”权限；前端可以提示用户，需要该权限（之一）才能执行
        containsExecutableForCurrentUser: true,
        currentUserManageable: true, // （后端计算出的属性，创建者或者与“manage_perms”相符的 currentUserManageable 才为 true）
        creator: 'bob', // 创建者
        children: [
          {
            type: 'direct-link',
            id: 16,
            title: 'KPI数据',
            currentUserExecutable: true,
            containsExecutableForCurrentUser: true, // （后端计算出的属性）
            computed_executable_perms: ['ke_general'], // （后端计算出的属性，如果没有配置，会直接拷贝父节点(folder)的computed_executable_perms）folder的perms是“执行”权限；前端可以提示用户，需要该权限（之一）才能执行
            currentUserManageable: true, // （后端计算出的属性）
            creator: 'bob',
            linkUrl: 'http://analyzer2.corp.youdao.com/'
          },
          {
            type: 'direct-link',
            id: 17,
            title: '绝密KPI数据',
            currentUserExecutable: false,
            containsExecutableForCurrentUser: false, // （后端计算出的属性）
            computed_executable_perms: ['ke_core'], // （后端计算出的属性，如果没有配置，会直接拷贝父节点(folder)的computed_executable_perms）folder的perms是“执行”权限；前端可以提示用户，需要该权限（之一）才能执行
            currentUserManageable: false, // （后端计算出的属性）
            creator: 'mary'
            // （后端剥离掉的数据）用户没有执行权限，则后端不提供对应的linkUrl
            // linkUrl: '/xxx.html',
          }
        ]
      },
      {
        type: 'folder',
        id: 5,
        title: '财务',
        computed_executable_perms: ['ke_financial'], // （后端计算出的属性，如果没有配置，会直接拷贝product的visible_perms）folder的perms是“执行”权限；前端可以提示用户，需要该权限（之一）才能执行
        currentUserManageable: true, // （后端计算出的属性）
        creator: 'bob',
        children: [
          {
            type: 'args-script',
            id: 8,
            title: '高中概要数据',
            currentUserExecutable: true, // （后端计算出的属性）当前用户是否有“执行”权限
            containsExecutableForCurrentUser: true, // （后端计算出的属性）
            computed_executable_perms: ['ke_financial'], // （后端计算出的属性，如果没有配置，会直接拷贝folder的computed_executable_perms）args-script的perms是“执行”权限；前端可以提示用户，需要该权限（之一）才能执行
            currentUserManageable: true, // （后端计算出的属性）
            creator: 'bob',
            scriptId: '123',
            scriptParams: {
              param_a: 1,
              param_b: 2
            }
          },
          {
            type: 'args-script',
            id: 9,
            title: '实用英语概要数据',
            currentUserExecutable: false, // （后端计算出的属性）当前用户是否有“执行”权限
            containsExecutableForCurrentUser: false, // （后端计算出的属性）
            computed_executable_perms: ['ke_chief_financial'], // （后端计算出的属性）args-script的perms是“执行”权限；前端可以提示用户，需要该权限才能执行
            currentUserManageable: false, // （后端计算出的属性）
            creator: 'sammy'
            // （后端剥离掉的数据）用户没有执行权限，则后端不提供对应的scriptId和params
            // scriptId: '123',
            // scriptParams: {
            //   param_a: 3,
            //   param_b: 4
            // }
          }
        ]
      },
      {
        type: 'folder',
        id: 6,
        title: '市场',
        currentUserExecutable: true, // （后端计算出的属性）当前用户是否有“执行”权限
        computed_executable_perms: ['ke_general'],
        currentUserManageable: true, // （后端计算出的属性）
        containsExecutableForCurrentUser: true, // （后端计算出的属性）
        creator: 'bob',
        children: [
          {
            type: 'args-script',
            id: 10,
            title: 'Android端回访情况',
            currentUserExecutable: true, // （后端计算出的属性）
            containsExecutableForCurrentUser: true, // （后端计算出的属性）
            computed_executable_perms: ['ke_chief_financial'], // （后端计算出的属性）args-script的perms是“执行”权限；前端可以提示用户，需要该权限才能执行
            currentUserManageable: true, // （后端计算出的属性）
            creator: 'bob',
            scriptId: '456',
            scriptParams: {
              param_a: 4,
              param_b: 5
            }
          }
        ]
      },
      {
        type: 'folder',
        id: 7,
        title: '小工具',
        currentUserExecutable: true, // （后端计算出的属性）
        containsExecutableForCurrentUser: false, // （后端计算出的属性）为false是因为本节点目前是空的，不包含可执行的叶子节点
        computed_executable_perms: ['ke_general'], // （后端计算出的属性）
        currentUserManageable: true, // （后端计算出的属性）
        creator: 'bob',
        children: [
          // 空的
        ]
      }
    ]
  },
  {
    type: 'product',
    id: 3,
    title: '有道词典',
    visible_perms: ['dict_general'], // product的perms是“可见”权限，有该权限则所有子节点可见
    currentUserVisible: true, //  （后端计算出的属性）当前用户是否有“可见”权限
    containsExecutableForCurrentUser: true, // （后端计算出的属性）
    creator: 'bob',
    children: [
      // 空的
    ]
  },
  {
    type: 'product',
    id: 2,
    title: '有道云笔记',
    visible_perms: ['ynote_general'], // product的perms是“可见”权限，有该权限则所有子节点可见
    currentUserVisible: false, //  （后端计算出的属性）当前用户是否有“可见”权限
    containsExecutableForCurrentUser: false // （后端计算出的属性）
  }
]

var maxId = 100

// id -> node
var indexMap = {}

// id -> parentId
var indexParentMap = {}

function doIndex (target, parentId) {
  if (target === undefined) {
    // 无参数调用，直接处理root array
    doIndex(mockTreeNodes, -1)
  } else if (Array.isArray(target)) {
    // 清空索引，因为要重建
    indexMap = {}
    indexParentMap = {}
    // root array
    target.forEach(item => {
      doIndex(item, -1)
    })
  } else {
    // 索引当前节点
    if (indexMap[target.id] !== undefined) {
      let err = {
        msg: `错误！mock tree 出现重复id=${target.id}`
      }
      throw err
    }
    indexMap[target.id] = target
    indexParentMap[target.id] = parentId
    // 递归往下
    if (target.type === 'product' || target.type === 'folder') {
      if (target.children !== undefined) {
        target.children.forEach(item => {
          doIndex(item, target.id)
        })
      }
    }
  }
}
doIndex()

export const getDataTree = ({ url, type, body }) => {
  // 注意：
  //   product 只有 “visible_perms”，没有 “executable_perms”
  //   folder 只有 executable_perms”，没有 “visible_perms”
  //   args-script 只有 executable_perms”，没有 “visible_perms”

  return {
    treeNodes: mockTreeNodes
  }
}

function addNode ({ parentId, type, title }) {
  console.log(parentId)

  if (parentId === -1) {
    // 插入到root，插入的肯定是product类型
    if (type !== 'product') {
      let err = { msg: 'parentId==-1，只能插入product节点！' }
      throw err
    }
    let newNode = {
      type,
      id: (++maxId),
      title,
      visible_perms: ['ke_general'], // product的perms是“可见”权限，有该权限则所有子节点可见
      currentUserVisible: true, //  （后端计算出的属性）当前用户是否有“可见”权限
      containsExecutableForCurrentUser: true, // （后端计算出的属性）本节点或其子孙节点是否含有当前用户可执行的叶子节点
      creator: 'bob' // 创建者
    }
    mockTreeNodes.push(newNode)
    doIndex()
  } else {
    let target = indexMap[parentId]
    if (target === undefined) {
      let err = { msg: `parentId===${parentId}没找到！` }
      throw err
    }

    if (target.type === 'folder' || target.type === 'product') {
      // ok
    } else {
      // error
      let err = { msg: `parentId===${parentId} type === ${target.type}，不能插入子节点！` }
      throw err
    }

    // 插入folder / leaf 节点
    var newNode = {}
    newNode.type = type
    newNode.title = title
    newNode.id = (++maxId)
    if (type === 'folder') {
      let needCopy = [
        'currentUserExecutable',
        'containsExecutableForCurrentUser',
        'computed_executable_perms',
        'currentUserManageable',
        'creator']
      needCopy.forEach(x => {
        newNode[x] = _.cloneDeep(target[x])
      })
      newNode.children = []
    } else {
      // 插入leaf
      newNode.currentUserExecutable = true
      newNode.containsExecutableForCurrentUser = true
      newNode.computed_executable_perms = ['ke_general']
      newNode.currentUserManageable = true
      newNode.creator = 'bob'
      if (type === 'direct-link') {
        newNode.linkUrl = 'http://analyzer2.corp.youdao.com/'
      } else if (type === 'args-script') {
        newNode.scriptId = '456'
        newNode.scriptParams = {
          param_a: 4,
          param_b: 5
        }
      } else {
        let err = {
          msg: '插入leaf type=' + type + '不合法！'
        }
        throw err
      }
    } // leaf
    // 插入
    target.children.push(newNode)
    doIndex()
  }
}

export const addTreeNode = ({ url, type, body }) => {
  console.log(body)
  var j = JSON.parse(body)
  console.log('inserting ' + JSON.stringify(j))
  addNode(j)

  console.log('插入节点成功！ id=' + maxId)
  return {
    id: maxId
  }
}

export const renameTreeNode = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('renaming ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  target.title = j.title

  console.log('更名成功！')
  return {
    // 200 OK 即没问题
  }
}
export const moveTreeNode = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('moving ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  let targetParent = indexMap[j.parentId]
  if (targetParent === undefined) {
    let err = {
      msg: `id=${j.parentId} 节点不存在！`
    }
    throw err
  }

  if (targetParent.type !== 'folder' && targetParent.type !== 'product') {
    let err = {
      msg: `目标父亲节点 parentId=${j.parentId} 的类型不是folder/product，而是${targetParent.type}！`
    }
    throw err
  }

  // 原父亲节点
  let oldParentId = indexParentMap[j.id]
  let oldParent = indexMap[oldParentId]

  // 移动，注意，这里没有对权限等重新计算。
  // 实际接口会因为继承关系改变，而导致权限属性也有所改变
  for (let i = 0; i < oldParent.children.length; i++) {
    if (oldParent.children[i].id === target.id) {
      oldParent.children.splice(i, 1)
      targetParent.children.push(target)
    }
  }

  doIndex()
  console.log('移动成功！')
  return {
    // 200 OK 即没问题
  }
}

export const getPerms = ({ url, type, body }) => {
  debugger
  var j = JSON.parse(body)
  console.log('getting perms ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  var permList = []
  if (target.type === 'product') {
    permList.push({
      value: 'visible_perms',
      perms: _.cloneDeep(target.visible_perms)
    })
  } else {
    let parentNode = indexParentMap[j.id]
    let perms = []
    if (_.difference(target.computed_executable_perms, parentNode.computed_executable_perms).length === 0 &&
     _.difference(parentNode.computed_executable_perms, target.computed_executable_perms).length === 0) {
      // 与父节点相同，则认为是继承的
      perms = []
    } else {
      perms = _.cloneDeep(target.computed_executable_perms)
    }
    permList.push({
      value: 'executable_perms',
      perms
    })
  }

  return {
    id: j.id,
    permList
  }
}

export const setPerms = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('setting perms ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  var permList = j.permList
  if (target.type === 'product') {
    target.visible_perms = _.clone(permList.find(x => x.value === 'visible_perms')).perms
  } else {
    let parentNode = indexMap[indexParentMap[j.id]]
    let parentPerms
    if (parentNode.type === 'product') {
      parentPerms = parentNode.visible_perms
    } else {
      parentPerms = parentNode.computed_executable_perms
    }
    let newPerms = permList.find(x => x.value === 'executable_perms').perms
    target.computed_executable_perms = newPerms.length > 0 ? newPerms : parentPerms
  }

  return {
    // 200 OK，就是没问题
  }
}

export const copyNode = ({ url, type, body }) => {
  // 复制叶子节点
  var j = JSON.parse(body)
  console.log('copy node ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  if (target.type === 'product' || target.type === 'folder') {
    let err = {
      msg: `只能复制叶子结点！ 传入的是type=${target.type}`
    }
    throw err
  }

  let targetParentNode = indexMap[j.parentId]
  let newNode = _.cloneDeep(target)
  newNode.id = ++maxId
  newNode.creator = 'cc'
  newNode.currentUserManageable = true
  newNode.currentUserExecutable = true
  newNode.containsExecutableForCurrentUser = true
  targetParentNode.children.push(newNode)
  doIndex()
  return {
    // 200 OK，就是没问题
  }
}

export const getAttrs = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('get attrs ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  if (target.type === 'product') {
    // product 目前没有属性
    return {
      id: j.id,
      attrs: []
    }
  } else if (target.type === 'folder') {
    // folder 也没有属性
  } else if (target.type === 'direct-link') {
    // direct-link 的属性是linkUrl
    return {
      id: j.id,
      attrs: [
        {
          title: '目标url',
          attrKey: 'linkUrl',
          type: 'url',
          attrVal: target.linkUrl
        }
      ]
    }
  } else if (target.type === 'args-script') {
    // args-script 的属性是scriptId和scriptParams
    return {
      id: j.id,
      attrs: [
        {
          title: '脚本id',
          attrKey: 'script_id',
          type: 'script_id',
          attrVal: target.scriptId
        },
        {
          title: '脚本参数',
          attrKey: 'script_params',
          type: 'script_params',
          attrVal: JSON.stringify(target.scriptParams)
        }
      ]
    }
  } else {
    // 其他也没有属性；目前也没有其他
    return {
      id: j.id,
      attrs: []
    }
  }
}

export const setAttrs = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('set attrs ' + JSON.stringify(j))

  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err
  }

  if (target.type === 'product') {
    // product 目前没有属性
  } else if (target.type === 'folder') {
    // folder 也没有属性
  } else if (target.type === 'direct-link') {
    // direct-link 的属性是linkUrl
    target.linkUrl = j.attrs.find(x => x.attrKey === 'linkUrl').attrVal
  } else if (target.type === 'args-script') {
    // args-script 的属性是scriptId和scriptParams
    target.scriptId = j.attrs.find(x => x.attrKey === 'scriptId').attrVal
    target.scriptParams = JSON.parse(j.attrs.find(x => x.attrKey === 'scriptParams').attrVal)
  } else {
    // 其他也没有属性；目前也没有其他
  }
  return {
    // 200 OK
  }
}

export const deleteNode = ({ url, type, body }) => {
  var j = JSON.parse(body)
  console.log('delete node ' + JSON.stringify(j))
  let target = indexMap[j.id]
  if (target === undefined) {
    let err = {
      msg: `id=${j.id} 节点不存在！`
    }
    throw err

  }

  function removeFrom (arr, id) {
    for (let pos = 0; pos < arr.length; pos++) {
      if (arr[pos].id === target.id) {
        // 删除
        arr.splice(pos, 1)
      }
    }
  }

  if (target.type === 'product' || target.type === 'folder') {
    // 必须没有子节点
    if (target.children.length === 0) {
      if (target.type === 'product') {
        removeFrom(mockTreeNodes, j.id)
      } else {
        let parent = indexMap[indexParentMap[j.id]]
        removeFrom(parent.children, j.id)
      }
    } else {
      let err = {
        msg: `id=${j.id} type=${target.type} 节点非空！`
      }
      throw err
    }
  } else {
    // 叶子结点
    let parent = indexMap[indexParentMap[j.id]]
    removeFrom(parent.children, j.id)
  }
  doIndex()
}
