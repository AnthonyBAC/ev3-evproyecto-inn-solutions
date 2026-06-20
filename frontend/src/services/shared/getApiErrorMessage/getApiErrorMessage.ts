// Extrae el mensaje de error del body de una respuesta HTTP fallida, con fallback
export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data: unknown = await response.json()

    if (typeof data !== 'object' || data === null) {
      return fallbackMessage
    }

    const candidate = data as Record<string, unknown>

    if (typeof candidate.message === 'string') {
      return candidate.message
    }

    return fallbackMessage
  } catch {
    return fallbackMessage
  }
}
