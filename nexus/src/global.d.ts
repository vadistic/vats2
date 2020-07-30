type Node = {
  id: string
}

export interface PrismaModels extends Record<string, any> {
  Node: Node
}

export interface PrismaOutputs {
  Node: {
    id: 'ID'
  }
}

declare global {
  export interface PrismaGen {
    outputs: PrismaOutputs
    models: PrismaModels
  }

  export interface NexusContext {}
}
