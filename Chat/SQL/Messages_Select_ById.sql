USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ById]    Script Date: 5/10/2023 11:58:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Select Messages by Id
-- Code Reviewer:

-- MODIFIED BY: Dustin Polk
-- MODIFIED DATE: 03-17-2023
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Select_ById]
	@Id int

as

/* --- TEST ---

	DECLARE @Id int = 2

	EXECUTE [dbo].[Messages_Select_ById] @Id

*/

BEGIN

	SELECT m.Id
		  ,m.Message
		  ,m.Subject
		  ,m.RecipientId
			,ur.FirstName
			,ur.LastName
			,ur.Mi
			,ur.AvatarUrl
		  ,m.SenderId
			,us.FirstName
			,us.LastName
			,us.Mi
			,us.AvatarUrl
		  ,m.DateSent
		  ,m.DateRead
		  ,m.DateModified
		  ,m.DateCreated

	FROM [dbo].[Messages] AS m
	INNER JOIN [dbo].[Users] as ur
	  ON m.RecipientId = ur.Id
	INNER JOIN [dbo].[Users] as us
	  ON m.SenderId = us.Id

	WHERE m.Id = @Id

END
