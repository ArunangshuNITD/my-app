// app/template.js
export default async function Template({ children }) {
  // This pause forces Next.js to show "loading.js" immediately
  await new Promise((resolve) => setTimeout(resolve, 7000));

  return <>{children}</>;
}