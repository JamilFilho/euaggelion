/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'md' e 'mdx' das pageExtensions já que estamos usando next-mdx-remote
  // Os arquivos .mdx na pasta /content são carregados manualmente, não como páginas
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  experimental: {
    // Turbopack está em beta, pode causar problemas
    // Remova se encontrar outros erros
  },
};

export default nextConfig;