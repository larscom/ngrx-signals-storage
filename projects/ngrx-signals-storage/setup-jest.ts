Object.assign(global, { structuredClone: (val: any) => JSON.parse(JSON.stringify(val)) })
