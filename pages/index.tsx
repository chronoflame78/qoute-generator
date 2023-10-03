import { BackGroundImage1, BackGroundImage2, FooterCon, FooterLink, GenerateQuoteButton, GenerateQuoteButtonText, GradientBackgroundCon, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle } from "@/components/QuoteGenerator/QuoteGeneratorElements"
import Head from "next/head"
import Clouds1 from "@/assets/cloud-and-thunder.png"
import Clouds2 from "@/assets/cloudy-weather.png"
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { generateAQuote, quotesQueryName } from "@/src/graphql/queries";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import QuoteGeneratorModal from "@/components/QuoteGenerator";

//interface for DynamoDB object

interface GenerateAQuoteData {
  generateAQuote: {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  }
}

interface UpdateQuoteInfoData{
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}


//type guard for our fetch function
function isGraphQLResultForQuotesQueryName(response: any): response is GraphQLResult<{
  quotesQueryName: {
    items: [UpdateQuoteInfoData]
  }
}> {
  return response.data && response.data.quotesQueryName && response.data.quotesQueryName.items;
}




export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

  //Function to fetch our DynamoDB object (quotes generated)
  const updateQuoteInfo = async () => {
    try{
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: "AWS_IAM",
        variables: {
          queryName: "LIVE",
        }
      })

      console.log('response', response)

      //setNumberOfQuotes(response.data.qoutesQueryName.items[0].quotesGenerated)

      //Create type guards
      if(!isGraphQLResultForQuotesQueryName(response)){
        throw new Error("Unexpected response from GraphQL API")
      }

      if(!response.data){
        throw new Error("Response data is undefined");
      }

      const receivedNumberOfQuotes = response.data.quotesQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);

    } catch (error){
      console.log("error getting quote data", error);
    }
  }

  useEffect(() => {
    updateQuoteInfo();
  }, [])

  // Functions for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
    setProcessingQuote(false);
    setQuoteReceived(null);
  }

  const handleOpenGenerator = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
    try {
      // Run Lambda Function
      const runFunction = "runFunction";
      const runFunctionStringified = JSON.stringify(runFunction);
      const response = await API.graphql<GenerateAQuoteData>({
        query: generateAQuote,
        authMode: "AWS_IAM",
        variables: {
          input: runFunctionStringified,
        },
      });
      const responseStringified = JSON.stringify(response);
      const responseReStringified = JSON.stringify(responseStringified);
      const bodyIndex = responseReStringified.indexOf("body=") + 5;
      const bodyAndBase64 = responseReStringified.substring(bodyIndex);
      const bodyArray = bodyAndBase64.split(",");
      const body = bodyArray[0];
      console.log(body);
      setQuoteReceived(body);

      // End state:
      setProcessingQuote(false);

      // Fetch if any new quotes were generated from counter
      updateQuoteInfo();
       
      // setProcessingQuote(false);
      // setTimeout(() => {
      //   setProcessingQuote(false);
      // }, 3000);
    } catch (error) {
      console.log('error generating quote:', error);
      setProcessingQuote(false);
    }
  }

  return (
    <>
    <Head>
      <title>Quote Generator</title>
      <meta name="description" content="A quote generator" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/*Background*/}
    <GradientBackgroundCon>
      {/* Quote Generator Modal Pop-up */}
      <QuoteGeneratorModal
        open={openGenerator}
        close={handleCloseGenerator}
        processingQuote={processingQuote}
        setProcessingQuote={setProcessingQuote}
        quoteReceived={quoteReceived}
        setQuoteReceived={setQuoteReceived}
      />


      {/* Quote Generator*/}
      <QuoteGeneratorCon>
        <QuoteGeneratorInnerCon>
          <QuoteGeneratorTitle>
            Daily Inspiration Generator
          </QuoteGeneratorTitle>
          <QuoteGeneratorSubTitle>
            Looking for a splash of inspiration? Generate a quote card with a random inspirational quote provided by <FooterLink href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</FooterLink>.
          </QuoteGeneratorSubTitle>

          <GenerateQuoteButton onClick={handleOpenGenerator}>
            <GenerateQuoteButtonText>
              Make a Quote
            </GenerateQuoteButtonText>
          </GenerateQuoteButton>
        </QuoteGeneratorInnerCon>
      </QuoteGeneratorCon>

      <BackGroundImage1
      src={Clouds1}
      height="300"
      alt="cloudbackground1"
      />
      <BackGroundImage2
      src={Clouds2}
      height="300"
      alt="cloudbackground2"
      />
      <FooterCon>
        <>
          Quotes Generated: {numberOfQuotes}
          <br/>
          Developed by <FooterLink href="https://www.linkedin.com/in/nhatnguyen998/" target="_blank" rel="noopener noreferrer">@NhatNguyen</FooterLink>
        </>
      </FooterCon>
    </GradientBackgroundCon>

    
    </>
  )
}
