import { useRouter } from "next/router";
import Layout from "@/components/Layout";
const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized">
      <h1 className="text-lg text-indigo-400">Denied Acess</h1>
      {message && <div className="text-red-400">{message}</div>}
    </Layout>
  );
};
export default Unauthorized;
