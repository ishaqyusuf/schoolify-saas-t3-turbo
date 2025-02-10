export function firstOrThrow<T>(data: T[], error = "Not found") {
  const [f] = data;
  if (!f) throw new Error(error);
  return f;
}
export function dotValue<T>(obj: T, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
