import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import { IArticleModel } from "@/models/article.model";
import { requestArticleById } from "@/services/articleService";
import { updateArticles } from "@/store/slices/articleSlice";
import { useAppDispatch } from "@/store/store";
import { setAuthHeaders } from "@/utils/httpClient";

import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";

type Props = {
  article?: IArticleModel;
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const EditArticle = ({ article }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [title, setTitle] = React.useState(article?.title!);
  const [text, setText] = React.useState(article?.text!);
  
  const handleUpdateArticle = async (e: any) => {
    e.preventDefault();
    const id = article?.id;
    const response = await dispatch(updateArticles({ id, title, text }));
    if (response.meta.requestStatus === "fulfilled") {
      Toast.fire({
        icon: "success",
        title: "update article successfully",
      });
      router.push("/articles")
      setTitle("");
      setText("");
    } else {
      Toast.fire({
        icon: "error",
        title: "update article failed",
      });
    }
  };

 return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <EditForm
              title="Update Article"
              fields={[
                { label: "ID", value: article?.id, readOnly: true },
                { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), maxLength: 150 },
                { label: "Text", value: text, onChange: (e) => setText(e.target.value), type: "textarea", maxLength: 500 },
              ]}
              onSubmit={handleUpdateArticle}
              cancelRoute="/articles"
              entityName="Article"
              lastUpdated={article?.updatedAt}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(EditArticle);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id }: any = context.query;
  const headers = context.req.headers;

  
  setAuthHeaders(headers);
  
  if (id) {
    const article = await requestArticleById(id);
    return {
      props: {
        article,
      },
    };
  } else {
    return { props: {} };
  }
};
