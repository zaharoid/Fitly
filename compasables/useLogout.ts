export function useLogout() {
  const { signOut } = useAuth()
  return () => signOut({ callbackUrl: '/signin' })
}