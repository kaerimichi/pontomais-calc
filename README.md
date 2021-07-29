# Pontomais Calculator

The purpose of this tool is to calculate the time from your punches at the punch clock service [Pontomais](https://pontomais.com.br).

## Disclaimer

I don't work for Pontomais, I know nothing about them. I just happen to be working for a company that uses this tool and I find it very stupid to be doing the calculations by hand every time I need.

## Installation

```
$ npm i -g pontomais-calc
```

## Usage

```
Usage: pontomais-calc [options]

Options:
  -u, --username [username]  username or e-mail
  -f, --from-file [path]     corrections file path
  --use-balance              use balance from Pontomais
  --shift [shift]            work hours (default: "8")
  -h, --help                 display help for command
```

## Corrections Example

You can simulate the corrections by referencing a file with these correct punches. For example, let's say that you forgot to punch clock when you came back from lunch yesterday (let's say that it was **march 21**). You might have gotten into a sticky situation:

> 08:00, 12:00, 17:00

Well if you happen to have the tedious task of punching clock, this might not be something new to you. And if there's something a punch clock application doesn't like is odd punches. But, fear not!

Simple create a YAML file with this:

```
- date: 21
  punches: ['08:00', '12:00', '13:00', '17:00']
```

Then save this file (let's say `punchclocksucks.yaml`... you can put many corrections you need as long as they're from the current month) and then run the following command:

```
$ pontomais-calc -u <your-email-from-pontomais> -f punchclocksucks.yaml
```

It will ask for your password and then... Voilá!

```
{
  "currentTime": "09:49:29",
  "serverTime": "09:49:29",
  "dayClosureEstimate": {
    "workShiftBased": "17:00",
    "hourBankBased": "17:21"
  },
  "dayBalance": {
    "completed": {
      "asMinutes": 49,
      "asShortTime": "00:49"
    },
    "remaining": {
      "asMinutes": 431,
      "asShortTime": "07:11"
    },
    "extra": {
      "asMinutes": 0,
      "asShortTime": "00:00"
    }
  },
  "weekBalance": {
    "total": {
      "asMinutes": 0,
      "asShortTime": "00:00"
    },
    "completed": {
      "asMinutes": 0,
      "asShortTime": "00:00"
    },
    "remaining": {
      "asMinutes": 0,
      "asShortTime": "00:00"
    }
  },
  "monthBalance": {
    "completed": {
      "asMinutes": 9148,
      "asShortTime": "152:28"
    },
    "extra": {
      "asMinutes": -21,
      "asShortTime": "00:21",
      "isPositive": false
    }
  }
}
```

You got a bunch of numbers that might be helpful. But keep in mind that this is a simple calculation of the days you worked a total of hours specified in `--shift` option (defaults to 8). If you want, you can always calculate with the balance that comes from the Pontomais API using the `--use-balance` flag. This will then take the existent balance into account (might not be very helpful if your punches are a complete mess though).

## Variables

An environment variable called `SERVICE_ENDPOINT` can be used to indicate the endpoint to get the history of Pontomais. For now this is defaulting to an URL that points to a Lambda function that gets the punches of history and put them in a known format so I can trust and process in this script.

## Contributing

Feel free to open issues and PRs. But be aware that I made this at the end of a very busy day and it is not the code I would be eternally proud of.