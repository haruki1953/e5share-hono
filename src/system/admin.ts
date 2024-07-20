import fs from 'fs'
import { adminContact, systemAdminConfig, systemDataPath } from '@/config'
import type { AdminStore } from '@/types'
import { AppError } from '@/classes'
import { typesAdminStoreSchema } from '@/schemas'
import { confirmSaveFolderExists, generateRandomKey } from '@/utils'

export const useAdminSystem = () => {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const adminStore = store as AdminStore

  const confirmCouldRegister = () => {
    if (!adminStore.couldRegister) {
      throw new AppError(`注册已关闭，获取账号请联系管理员 ${adminContact}`)
    }
  }

  const updateAuth = (username: string, password: string) => {
    adminStore.username = username
    adminStore.password = password
    save()
  }

  const updateInfo = (couldRegister: boolean) => {
    adminStore.couldRegister = couldRegister
    save()
  }

  return {
    store: adminStore,
    confirmCouldRegister,
    updateAuth,
    updateInfo
  }
}

let store: null | AdminStore = null

const filePath = systemAdminConfig.storeFile

const setup = () => {
  try {
    load()
  } catch (error) {
    init()
  }
}

// load data from file
const load = () => {
  const dataJson = fs.readFileSync(filePath, 'utf8')
  const dataObj = JSON.parse(dataJson)
  store = typesAdminStoreSchema.parse(dataObj)
}

const save = () => {
  const data = JSON.stringify(store, null, 2)
  fs.writeFileSync(filePath, data, 'utf8')
}

const init = () => {
  try {
    store = {
      username: 'admin',
      password: '123456',
      couldRegister: true,
      jwtMainSecretKey: generateRandomKey(),
      jwtAdminSecretKey: generateRandomKey()
    }
    confirmSaveFolderExists(systemDataPath)
    save()
  } catch (error) {
    onError()
  }
}

const onError = () => {
  throw new AppError(`初始化失败 ${filePath}`)
}

setup()
