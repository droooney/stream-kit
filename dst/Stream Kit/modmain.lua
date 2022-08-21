local bosses = {
  "alterguardian_phase1",
  "alterguardian_phase2",
  "alterguardian_phase3",
  "antlion",
  "beequeen",
  "crabking",
  "dragonfly",
  "eyeofterror",
  "klaus",
  "malbatross",
  "shadowchess",
  "stalker",
  "toadstool",
}

local bossesTimeouts = {
  alterguardian_phase1 = 15,
  alterguardian_phase2 = 15,
}

local playingMusic = false
local stopMusicTask

function findBoss(boss)
  for _, b in ipairs(bosses) do
    if b == boss then
      return true
    end
  end

  return false
end

function startBossMusic(bossName)
  playingMusic = true

  GLOBAL.TheSim:QueryServer("http://localhost:3883/api/startBoss?bossName=" .. bossName, function () end, "POST", "{}")
  GLOBAL.TheMixer:SetLevel("set_music", 0.2)
end

function stopBossMusic(bossName)
  playingMusic = false

  GLOBAL.TheSim:QueryServer("http://localhost:3883/api/endBoss?bossName=" .. bossName, function () end, "POST", "{}")
  GLOBAL.TheMixer:SetLevel("set_music", 0)
end

AddPlayerPostInit(function (inst)
  inst:ListenForEvent("triggeredevent", function (_, data)
    local bossName = data.name

    if not findBoss(bossName) then
      return
    end

    if not playingMusic then
      startBossMusic(bossName)
    end

    if stopMusicTask then
      stopMusicTask:Cancel()
    end

    stopMusicTask = inst:DoTaskInTime(bossesTimeouts[bossName] or 3, function ()
      stopBossMusic(bossName)
    end)
  end)
end)