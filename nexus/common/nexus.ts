import { NexusSchemaStatefulBuilders } from 'nexus/dist/lib/nexus-schema-stateful'
import { NexusObjectTypeConfig } from 'nexus/dist/lib/nexus-schema-stateful/custom-types'
import {} from '@nexus/schema'

type ArgType<T> = T extends (arg: infer A) => any ? A : never

export type NexusOutputTypenames = NexusGen['allOutputTypes']

export type NexusObjectTypeDefinition = ArgType<NexusSchemaStatefulBuilders['objectType']>['definition']

export type NexusObjectTypeDefinitionProxy = ArgType<NexusObjectTypeConfig<string>['definition']>
