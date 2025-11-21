// Minimal mock implementations for 'better-auth/plugins'

export function twoFactor(_: any = {}) {
  return { name: 'twoFactor' } as any;
}

export function username(_: any = {}) {
  return { name: 'username' } as any;
}

export function phoneNumber(_: any = {}) {
  return { name: 'phoneNumber' } as any;
}

export function admin(_: any = {}) {
  return { name: 'admin' } as any;
}

export function apiKey(_: any = {}) {
  return { name: 'apiKey' } as any;
}

export function organization(_: any = {}) {
  return { name: 'organization' } as any;
}

export function captcha(_: any = {}) {
  return { name: 'captcha' } as any;
}

export function multiSession(_: any = {}) {
  return { name: 'multiSession' } as any;
}

export function oAuthProxy(_: any = {}) {
  return { name: 'oAuthProxy' } as any;
}

export function openAPI(_: any = {}) {
  return { name: 'openAPI' } as any;
}
