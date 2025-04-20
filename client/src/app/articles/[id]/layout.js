
export const generateMetadata = async (params) => {
    const {id} = await params;

    //TODO fetch description and title and also create OG links from the data of the article.
    return {
        title : "d"
    }
}
  
  export default function RootLayout({ children }) {
    return (
      <>{children}</>
    );
  }
  