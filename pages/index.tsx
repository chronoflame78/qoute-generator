import { BackGroundImage1, BackGroundImage2, FooterCon, FooterLink, GenerateQuoteButton, GenerateQuoteButtonText, GradientBackgroundCon, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle } from "@/components/QuoteGenerator/QuoteGeneratorElements"
import Head from "next/head"
import Clouds1 from "@/assets/cloud-and-thunder.png"
import Clouds2 from "@/assets/cloudy-weather.png"
import { useState } from "react";

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

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


      {/* Quote Generator*/}
      <QuoteGeneratorCon>
        <QuoteGeneratorInnerCon>
          <QuoteGeneratorTitle>
            Daily Inspiration Generator
          </QuoteGeneratorTitle>
          <QuoteGeneratorSubTitle>
            Looking for a splash of inspiration? Generate a quote card with a random inspirational quote provided by <FooterLink href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</FooterLink>.
          </QuoteGeneratorSubTitle>

          <GenerateQuoteButton onClick={null}>
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
